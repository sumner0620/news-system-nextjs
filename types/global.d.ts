// Minimal JSX/React ambient types if @types/react are missing during initial setup
declare namespace JSX {
    interface IntrinsicElements {
        [elemName: string]: any;
    }
}


