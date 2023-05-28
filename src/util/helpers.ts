export const generateDueDate = (rentalPeriod: number) => {
    const today = new Date();
    return new Date(today.getTime() + (rentalPeriod * 86400000))
}