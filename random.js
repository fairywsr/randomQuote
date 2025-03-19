const btnQuote = document.getElementById('newQuote'); // button for new quote
const quoteElement = document.getElementById('quote'); // p tag for quote
const authorElement = document.getElementById('author'); // span tag for author
const copybtn = document.getElementById('copyBtn');  // copy button for quote 
const randomImage = document.getElementById('randomImage');  // quote background image link with displayImage function
const quoteImagebtn = document.getElementById('quoteImage');  // button for download image with quote


// function to generate random images and display 
async function displayImage() {
    try {
        const response = await fetch('https://picsum.photos/400/300'); // api for random images
        
        if (response.ok) {
            randomImage.src = response.url; 
            // console.log(response.url);
        } else {
            console.error("Error fetching image:", response.statusText);
        }
    } catch (error) {
        console.error("Error fetching image:", error);
    }
}



//  APi for random Quotes
async function getQuote() {
     const response = await fetch('https://api.freeapi.app/api/v1/public/quotes/quote/random');
     const Data = await response.json();
     return Data;
}

//  function for copy quote
function copyQuote(){
     const textCopy = quoteElement.innerText;
    navigator.clipboard.writeText(textCopy)
}

// random quote with random image --functions-- 
btnQuote.addEventListener('click', async () => {
    displayImage()
    const quoteData = await getQuote();
    const quote = quoteData.data.content;
    const author = quoteData.data.author;
    quoteElement.textContent = quote;
    authorElement.textContent = author;

});

// copy Quote function calling 
copybtn.addEventListener('click', copyQuote);


// downloading Image
function downloadImage() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const image = document.getElementById('randomImage');
    const quoteText = document.getElementById('quote').innerText;
    const authorText = document.getElementById('author').innerText;

    const tempImage = new Image();
    tempImage.crossOrigin = "anonymous";
    tempImage.src = image.src;

    tempImage.onload = function () {
        canvas.width = tempImage.width;
        canvas.height = tempImage.height;
        ctx.drawImage(tempImage, 0, 0, canvas.width, canvas.height);

        // Draw rounded rectangle background
        const boxX = 50;
        const boxY = canvas.height - 250;
        const boxWidth = canvas.width - 550;
        const boxHeight = 120;
        const borderRadius = 20;

        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.beginPath();
        ctx.moveTo(boxX + borderRadius, boxY);
        ctx.lineTo(boxX + boxWidth - borderRadius, boxY);
        ctx.quadraticCurveTo(boxX + boxWidth, boxY, boxX + boxWidth, boxY + borderRadius);
        ctx.lineTo(boxX + boxWidth, boxY + boxHeight - borderRadius);
        ctx.quadraticCurveTo(boxX + boxWidth, boxY + boxHeight, boxX + boxWidth - borderRadius, boxY + boxHeight);
        ctx.lineTo(boxX + borderRadius, boxY + boxHeight);
        ctx.quadraticCurveTo(boxX, boxY + boxHeight, boxX, boxY + boxHeight - borderRadius);
        ctx.lineTo(boxX, boxY + borderRadius);
        ctx.quadraticCurveTo(boxX, boxY, boxX + borderRadius, boxY);
        ctx.closePath();
        ctx.fill();

        // Quote Text
        ctx.fillStyle = "#fff";
        ctx.font = "bold 1.8rem Arial";
        ctx.textAlign = "center";
        wrapText(ctx, quoteText, canvas.width / 2, canvas.height - 140, canvas.width - 140, 32);

        // Author Text
        ctx.font = "bold 1.4rem Arial";
        ctx.textAlign = "right";
        ctx.fillText(authorText, canvas.width - 80, canvas.height - 70);

        const link = document.createElement('a');
        link.download = 'quote.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let lines = [];

    for (let i = 0; i < words.length; i++) {
        let testLine = line + words[i] + ' ';
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;

        if (testWidth > maxWidth && i > 0) {
            lines.push(line);
            line = words[i] + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push(line);

    for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], x, y + (i * lineHeight));
    }
}



