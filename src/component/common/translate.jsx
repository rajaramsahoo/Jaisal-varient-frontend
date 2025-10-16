import { useEffect } from "react";
import { IoGlobeSharp } from "react-icons/io5";

const GoogleTranslate = () => {
    useEffect(() => {
        const addGoogleTranslateScript = () => {
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src =
                "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;
            document.body.appendChild(script);
        };

        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: "en",
                    includedLanguages: "en,hi,bn,te,mr,ta,ur,gu,kn,ml,pa,as,or",
                    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                },
                "google_translate_element"
            );
        };

        addGoogleTranslateScript();
    }, []);

    return (
        <div
            className="newGlobeStyle"
            style={{ textAlign: "right", display: "flex", alignItems: "center" }}
        >
            <img src="/assets/images/globe.png" alt="" />
            <div id="google_translate_element"></div>
        </div>
    );
};

export default GoogleTranslate;
