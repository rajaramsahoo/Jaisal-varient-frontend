import React from "react"

const JaisalLoader = () => {
    const fullText = "JAISAL ORGANICS"

    return (
        <div className="loader-container">
            {fullText.split("").map((letter, index) => (
                <span
                    key={index}
                    className="loader-text animate-wave-fade"
                    style={{
                        animationDelay: `${index * 0.2}s`,
                        animationDuration: "2s",
                    }}
                >
                    {letter}
                </span>
            ))}
        </div>
    )
}

export default JaisalLoader
