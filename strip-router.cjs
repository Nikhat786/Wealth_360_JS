const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('c:\\Nikhat\\Roarathon\\Wealth_360\\Wealth_360_JS\\src\\routes', function(filePath) {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Convert import { createFileRoute } from "@tanstack/react-router"; 
    // to import { Link } from "react-router-dom" if Link is present
    if (content.includes('@tanstack/react-router')) {
       if (content.includes('Link')) {
           content = content.replace(/import\s*\{[^}]*\}\s*from\s*["']@tanstack\/react-router["'];?/g, 'import { Link } from "react-router-dom";');
       } else {
           content = content.replace(/import\s*\{[^}]*\}\s*from\s*["']@tanstack\/react-router["'];?/g, '');
       }
    }

    // Remove export const Route = createFileRoute(...)({ ... component: ComponentName })
    // Since babel preserves formatting, it might be multi-line. We will just use regex to remove it
    // and rely on the fact that Tanstack router pages usually have the component defined as a function.
    content = content.replace(/export\s+const\s+Route\s*=\s*createFileRoute[\s\S]*?(?=\n(?:export\s+default|export\s+function|function|const))/g, '');
    content = content.replace(/export\s+const\s+Route\s*=\s*createFileRoute[\s\S]*?\);/g, '');

    // Add export default to functions that end with Page, Screen, Review etc if they don't have it
    content = content.replace(/^function\s+([A-Za-z0-9_]+(Page|Screen|Review|Journey|Dashboard|Analysis))\s*\(/gm, 'export default function $1(');

    fs.writeFileSync(filePath, content);
  }
});
