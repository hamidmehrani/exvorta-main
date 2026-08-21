#!/bin/bash
echo "Starting Next.js production server..."
NODE_OPTIONS=--dns-result-order=ipv4first npm run start &
NEXT_PID=$!

echo "Waiting for server to be ready on port 3000..."
while ! curl -s http://localhost:3000 > /dev/null; do
  sleep 2
done
echo "Server is ready!"

ROUTES=("/" "/portfolio" "/portfolio/nutave" "/insights" "/rfq" "/ecosystem")

mkdir -p lighthouse-baselines

for ROUTE in "${ROUTES[@]}"; do
  echo "Running Lighthouse for $ROUTE..."
  FILENAME=$(echo "$ROUTE" | sed 's/\//_/g')
  if [ "$FILENAME" == "_" ]; then
    FILENAME="_home"
  fi
  npx -y lighthouse "http://localhost:3000$ROUTE" --no-enable-error-reporting --chrome-flags="--headless" --output json --output-path "lighthouse-baselines/baseline${FILENAME}.json" --only-categories=performance,accessibility,best-practices,seo
done

echo "Killing Next.js server (PID: $NEXT_PID)..."
kill $NEXT_PID
echo "Done!"
