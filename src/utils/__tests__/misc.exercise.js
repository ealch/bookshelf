const { formatDate } = require('utils/misc')

it("should format the date correctly", () => {
    const date = formatDate(new Date("01/01/2023"))
    expect(date).toBe("Jan 23")
})

