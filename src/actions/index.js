export const students = (type,payload) => ({
    type, 
    payload
})

export const studentData = (type, data) => dispatch => {
    dispatch(students(type,data))
}