import { GET_ALL_STUDENTS, CREATE_STUDENT, UPDATE_STUDENT } from "../utils/ActionTypes";

const initialState = {
    allStudents: [],
};


const studentREducer = (state = initialState, action) => {
    let mutateState = []
    switch (action.type) {
        case GET_ALL_STUDENTS:
            return { ...state,
                allStudents: action.payload
            }
        case CREATE_STUDENT:
            if(state.allStudents.length>0)
            return { ...state,
                allStudents: [...state.allStudents,action.payload]
            }
            else 
            return { ...state,
                allStudents: [action.payload]
            }
        case UPDATE_STUDENT:
            mutateState = state.allStudents.filter((t,i)=>{
                if(t.id !== action.payload.id) {
                   return t
                }  
            })
            return { ...state,
                allStudents: [...mutateState,action.payload]
            }
         
                        
        default:
            return state;
    }
};
export default studentREducer;