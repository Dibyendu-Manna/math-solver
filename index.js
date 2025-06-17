let innerUploadImage = document.querySelector(".inner-upload-image");
let input = innerUploadImage?.querySelector("input");
let image = document.querySelector("#image");
let btn = document.querySelector("button");
let text = document.querySelector("#text");
let output = document.querySelector(".output");

const Api_url = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=AIzaSyBCJ8ZmeuuTucD8BeUZsN_bTtg-jfKv8nU";


let fileDetails = {
    mime_type: null,
    data: null
};

async function generateResponse() {
    if (!fileDetails.data || !fileDetails.mime_type) {
        text.innerHTML = "❗ Please upload a valid image first.";
        output.style.display = "block";
        return;
    }

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [
                {
                    role: "user",
                    parts: [
                        {
    text: "Solve the math problem in the image step-by-step with clear explanation. Add line breaks between each step like a teacher writing on a board. Format it cleanly."
},

                        {
                            inline_data: {
                                mime_type: fileDetails.mime_type,
                                data: fileDetails.data
                            }
                        }
                    ]
                }
            ]
        })
    };

    try {
        text.innerHTML = "⏳ Processing...";
        output.style.display = "block";

        const response = await fetch(Api_url, requestOptions);
        const data = await response.json();

        console.log("🧠 API raw response:", data);

        if (!data || !data.candidates || !data.candidates[0]) {
            text.innerHTML = "❌ No valid response from Gemini model.";
            return;
        }

    let apiResponse = data.candidates[0].content.parts[0].text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .trim();

text.innerHTML = `<pre class="formatted-response">${apiResponse}</pre>`;
output.style.display = "block";

    } catch (e) {
        console.error("🚨 Error during fetch:", e);
        text.innerHTML = "❌ Something went wrong. Check console for details.";
    }
}

input.addEventListener("change", () => {
    const file = input.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
        alert("File too large! Max 5MB.");
        return;
    }

    console.log("📁 File selected:", file.name, file.type);

    let reader = new FileReader();
    reader.onload = (e) => {
        let base64data = e.target.result.split(",")[1];
        fileDetails.mime_type = file.type;
        fileDetails.data = base64data;

        console.log("✅ MIME Type:", fileDetails.mime_type);
        console.log("📦 Base64 Length:", base64data.length);

        innerUploadImage.querySelector("span").style.display = "none";
        innerUploadImage.querySelector("#icon").style.display = "none";

        image.style.display = "block";
        image.src = `data:${fileDetails.mime_type};base64,${fileDetails.data}`;

        output.style.display = "none";
    };

    reader.readAsDataURL(file);
});

innerUploadImage.addEventListener("click", () => {
    input.click();
});

btn.addEventListener("click", generateResponse);
