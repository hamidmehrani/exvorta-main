import payload from 'payload';
import config from '../payload.config';

const LOCALES = ['ar', 'fa'];

async function run() {
  const pageSlug = process.argv[2];
  if (!pageSlug) {
    console.error("Please provide a page slug. Example: tsx scripts/sync-page-images.ts home");
    process.exit(1);
  }

  await payload.init({ config });
  
  const pagesEn = await payload.find({ 
    collection: 'pages', 
    where: { slug: { equals: pageSlug } },
    limit: 1, 
    locale: 'en',
    depth: 0 
  });

  const pageEn = pagesEn.docs[0];
  if (!pageEn || !pageEn.blocks) {
    console.log(`Page '${pageSlug}' not found or has no blocks.`);
    process.exit(0);
  }

  console.log(`\n=== EXECUTING SYNC FOR PAGE: ${pageEn.slug} ===\n`);

  // We'll collect the locale versions of the page blocks to analyze consensus
  const localeBlocks: Record<string, any[]> = {};
  for (const loc of LOCALES) {
    const pageLoc = await payload.findByID({ collection: 'pages', id: pageEn.id, locale: loc, depth: 0 });
    localeBlocks[loc] = pageLoc.blocks || [];
  }

  // We will build deep copies of the blocks to mutate
  const updatedBlocksEn = JSON.parse(JSON.stringify(pageEn.blocks));
  const updatedBlocksLoc: Record<string, any[]> = {};
  for (const loc of LOCALES) {
    updatedBlocksLoc[loc] = JSON.parse(JSON.stringify(localeBlocks[loc]));
  }

  let enChanged = false;
  const locChanged: Record<string, boolean> = { ar: false, fa: false, tr: false, es: false };

  // We traverse the blocks
  for (let i = 0; i < updatedBlocksEn.length; i++) {
    const blockEn = updatedBlocksEn[i];
    const blockType = blockEn.blockType;
    
    const applyImages = (objEn: any, locObjects: Record<string, any>, path: string) => {
      if (!objEn || typeof objEn !== 'object') return;

      for (const key of Object.keys(objEn)) {
        if (key === 'image') {
          const valEn = objEn[key];
          const idEn = valEn && typeof valEn === 'object' ? valEn.id || valEn.value : valEn;
          
          const locIds: Record<string, any> = {};
          let discrepancy = false;
          
          for (const loc of LOCALES) {
            const objLoc = locObjects[loc];
            const valLoc = objLoc ? objLoc[key] : null;
            const idLoc = valLoc && typeof valLoc === 'object' ? valLoc.id || valLoc.value : valLoc;
            locIds[loc] = idLoc;
            if (idLoc !== idEn) discrepancy = true;
          }

          if (discrepancy) {
            let targetVal = idEn;
            
            if (idEn === null) {
              const uniqueLocVals = Array.from(new Set(Object.values(locIds)));
              if (uniqueLocVals.length === 1 && uniqueLocVals[0] !== null) {
                const consensusVal = uniqueLocVals[0];
                if (blockType === 'productsHero' && consensusVal === 469) {
                  targetVal = 469;
                } else if (blockType === 'facilityHighlight' && consensusVal === 458) {
                  targetVal = 458;
                }
              }
            }

            // Update EN if needed
            if (targetVal !== idEn) {
              objEn[key] = targetVal;
              enChanged = true;
              console.log(`  [EN] Updated ${path}.image to ${targetVal}`);
            }
            // Update other locales if needed
            for (const loc of LOCALES) {
              const objLoc = locObjects[loc];
              if (objLoc && locIds[loc] !== targetVal) {
                objLoc[key] = targetVal;
                locChanged[loc] = true;
                console.log(`  [${loc.toUpperCase()}] Updated ${path}.image to ${targetVal}`);
              }
            }
          }
        } else if (Array.isArray(objEn[key])) {
          const arrEn = objEn[key];
          for (let idx = 0; idx < arrEn.length; idx++) {
            const locArrays: Record<string, any> = {};
            for (const loc of LOCALES) {
              locArrays[loc] = locObjects[loc] && locObjects[loc][key] ? locObjects[loc][key][idx] : null;
            }
            applyImages(arrEn[idx], locArrays, `${path}.${key}[${idx}]`);
          }
        } else if (typeof objEn[key] === 'object' && objEn[key] !== null) {
           const nestedLocObjs: Record<string, any> = {};
           for (const loc of LOCALES) {
             nestedLocObjs[loc] = locObjects[loc] && locObjects[loc][key] ? locObjects[loc][key] : null;
           }
           applyImages(objEn[key], nestedLocObjs, `${path}.${key}`);
        }
      }
    };

    const locBlockObjs: Record<string, any> = {};
    for (const loc of LOCALES) {
      locBlockObjs[loc] = updatedBlocksLoc[loc][i];
    }

    applyImages(blockEn, locBlockObjs, `blocks[${i}](${blockType})`);
  }

  // Write changes to database
  if (enChanged) {
    console.log(`\nSaving EN changes...`);
    await payload.update({
      collection: 'pages',
      id: pageEn.id,
      locale: 'en',
      data: { blocks: updatedBlocksEn }
    });
  }

  for (const loc of LOCALES) {
    if (locChanged[loc]) {
      console.log(`Saving ${loc.toUpperCase()} changes...`);
      await payload.update({
        collection: 'pages',
        id: pageEn.id,
        locale: loc,
        data: { blocks: updatedBlocksLoc[loc] }
      });
    }
  }

  console.log(`\n=== SYNC COMPLETE ===`);
  process.exit(0);
}

run();
