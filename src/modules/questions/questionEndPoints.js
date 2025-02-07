import { systemRoles } from "../../utilities/systemRole.js";

export const addQuestionpoints = {
    ADD_QUESTION: [systemRoles.ADMIN,systemRoles.SUPER_ADMIN],
    UPDATE_QUESTION: [systemRoles.ADMIN,systemRoles.SUPER_ADMIN],

} 