// Touch screens have no hover to preview a name in the artist and project
// lists, so there the first tap previews it and a second tap opens it.
export function previewsOnTap() {
    return window.matchMedia('(hover: none)').matches
}
