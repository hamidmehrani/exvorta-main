import payload from 'payload';
import config from '../payload.config';

async function run() {
  await payload.init({ config });
  
  const pages = await payload.find({ 
    collection: 'pages', 
    limit: 100, 
    locale: 'en',
    depth: 1 
  });

  const brokenImages: any[] = [];
  
  for (const page of pages.docs) {
    if (!page.blocks) continue;

    console.log(`\n=== PAGE: ${page.slug} ===`);
    
    // Recursive function to find images
    const findImages = async (obj: any, path: string) => {
      if (!obj || typeof obj !== 'object') return;

      for (const key of Object.keys(obj)) {
        if (key === 'image') {
          const val = obj[key];
          
          if (val === null || val === undefined) {
            console.log(`[${path}.image] -> NULL or MISSING`);
            brokenImages.push({ page: page.slug, path, issue: 'null' });
          } else if (typeof val === 'string' || typeof val === 'number') {
            console.log(`[${path}.image] -> ID: ${val} (Unpopulated - Media Doc Missing?)`);
            brokenImages.push({ page: page.slug, path, id: val, issue: 'missing_media_doc' });
          } else if (typeof val === 'object' && val !== null) {
            const mediaId = val.id;
            const url = val.url;
            console.log(`[${path}.image] -> Media ID: ${mediaId} | URL: ${url}`);
            
            if (!url) {
               console.log(`    ! No URL found for media ID ${mediaId}`);
               brokenImages.push({ page: page.slug, path, id: mediaId, issue: 'no_url' });
               continue;
            }

            try {
              const res = await fetch(url, { method: 'HEAD' });
              if (!res.ok) {
                console.log(`    ! Broken URL (${res.status}): ${url}`);
                brokenImages.push({ page: page.slug, path, id: mediaId, url, issue: `http_${res.status}` });
              } else {
                console.log(`    [OK] URL Status: ${res.status}`);
              }
            } catch (e: any) {
              console.log(`    ! Fetch Error: ${e.message}`);
              brokenImages.push({ page: page.slug, path, id: mediaId, url, issue: 'fetch_error' });
            }
          }
        } else if (Array.isArray(obj[key])) {
          const arr = obj[key];
          for (let i = 0; i < arr.length; i++) {
            await findImages(arr[i], `${path}.${key}[${i}]`);
          }
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          await findImages(obj[key], `${path}.${key}`);
        }
      }
    };

    for (let i = 0; i < page.blocks.length; i++) {
      await findImages(page.blocks[i], `blocks[${i}](${page.blocks[i].blockType})`);
    }
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`Total broken images found: ${brokenImages.length}`);
  process.exit(0);
}

run();
