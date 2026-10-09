const fs = require('fs');

const files = [
  'src/pages/Home.tsx',
  'src/pages/AboutUs.tsx',
  'src/pages/Contact.tsx',
  'src/pages/Network.tsx',
  'src/pages/Platform.tsx',
  'src/pages/Partners.tsx',
  'src/pages/Advertisers.tsx',
  'src/components/Footer.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace standalone gap/margin classes with responsive versions
    // Only if they are not already prefixed (e.g. not lg:mb-20)
    content = content.replace(/(?<![:\w-])mb-20\b/g, 'mb-8 lg:mb-20');
    content = content.replace(/(?<![:\w-])mb-24\b/g, 'mb-10 lg:mb-24');
    content = content.replace(/(?<![:\w-])mb-32\b/g, 'mb-12 lg:mb-32');
    
    content = content.replace(/(?<![:\w-])py-24\b/g, 'py-12 lg:py-24');
    content = content.replace(/(?<![:\w-])py-20\b/g, 'py-10 lg:py-20');
    
    content = content.replace(/(?<![:\w-])pb-20\b/g, 'pb-10 lg:pb-20');
    content = content.replace(/(?<![:\w-])pb-24\b/g, 'pb-10 lg:pb-24');
    
    content = content.replace(/(?<![:\w-])gap-16\b/g, 'gap-8 lg:gap-16');
    content = content.replace(/(?<![:\w-])gap-20\b/g, 'gap-10 lg:gap-20');
    
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
