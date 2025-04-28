import Container from "@/components/Container";

export default async function ErrorPage({ params }: { params: { statusCode: string } }) {
    const statusCode = parseInt((await params).statusCode, 10);

    const ERROR_MESSAGES: Record<number, string> = {
        400: "Bad Request: The server could not understand the request due to invalid syntax.",
        401: "Unauthorized: The request requires user authentication.",
        403: "Forbidden: The server understood the request, but refuses to authorize it.",
        404: "Not Found: The requested resource could not be found.",
        405: "Method Not Allowed: The request method is not supported for the requested resource.",
        409: "Conflict: The request could not be completed due to a conflict with the current state of the resource.",
        500: "Internal Server Error: The server encountered an unexpected condition.",
    };

    const ERROR_IMAGES: string[] = [
        "https://media1.tenor.com/m/1BWouEztZM4AAAAd/troubleshooting-it.gif",
        "https://media1.tenor.com/m/S9sScUagl9UAAAAd/ih-mo.gif",
        "https://media1.tenor.com/m/7t8foti8FG8AAAAd/loading-screen-cat.gif",
        "https://media1.tenor.com/m/gK32v_OWs0kAAAAd/omg-cat.gif",
        "https://media1.tenor.com/m/0yJbcfwQyu8AAAAd/cry-crying.gif",
        "https://media1.tenor.com/m/pFz1Q12_hXEAAAAd/cat-holding-head-cat.gif",
        "https://media1.tenor.com/m/Lg21skpXtU4AAAAd/cat-meme.gif"
    ];
    const randomImage = statusCode == 403 ? "https://media1.tenor.com/m/wKNwPQiMz9EAAAAd/wtff-cat-confused-orange.gif" : ERROR_IMAGES[Math.floor(Math.random() * ERROR_IMAGES.length)];


    const errorMessage = ERROR_MESSAGES[statusCode] || "An unknown error occurred.";

    return (
        <Container>
            <h1 className="text-4xl font-bold mb-4">{statusCode ? `Error ${statusCode}` : "Unknown Error"}</h1>
            <p>
                {statusCode
                ? `${errorMessage}`
                : "An unknown error without a specific status code occurred."}
            </p>
            <p>Please try again later or contact support if the issue persists.</p>
            <img 
                src={randomImage} 
                alt="Error Image" 
                className="w-1/2 mx-auto mt-4 max-h-64 object-contain" 
            />
        </Container>
    );
}