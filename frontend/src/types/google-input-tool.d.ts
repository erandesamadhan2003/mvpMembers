declare module 'google-input-tool' {
    function googleTransliterate(
        request: XMLHttpRequest,
        sourceText: string,
        inputLanguage: string,
        maxResult: number,
    ): Promise<string[][]>

    export default googleTransliterate
}