import fs from "fs";
import path from "path";

const rootDir = "./src"; // المجلد الذي تريد البدء منه

function toCamelCase(str)
{
  return str.replace(/^(.)/, (match) => match.toLowerCase());
}

function renameRecursive(currentPath)
{
  const files = fs.readdirSync(currentPath);

  files.forEach((file) =>
  {
    const fullPath = path.join(currentPath, file);
    const stats = fs.statSync(fullPath);

    // تحويل الاسم لـ camelCase (تصغير أول حرف)
    const newName = toCamelCase(file);
    const newPath = path.join(currentPath, newName);

    if (file !== newName)
    {
      fs.renameSync(fullPath, newPath);
      console.log(`Renamed: ${file} -> ${newName}`);
    }

    // إذا كان مجلداً، ادخل داخله
    if (stats.isDirectory())
    {
      renameRecursive(newPath);
    }
  });
}

console.log("Starting rename process...");
renameRecursive(rootDir);
console.log("Done!");
