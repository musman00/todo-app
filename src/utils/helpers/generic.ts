export const resetForm = (form: any) => {
    for (const key in form) {
        if (form.hasOwnProperty(key)) {
            form[key] = '';
        }
    }
}