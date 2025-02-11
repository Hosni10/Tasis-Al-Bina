import { systemRoles } from "../../utilities/systemRole.js";

export const addUsersEndpoints = {
    ADD_USER: [systemRoles.SUPER_ADMIN],
    DELETE_USER: [systemRoles.SUPER_ADMIN],
    UPDATE_USER: [systemRoles.SUPER_ADMIN],
}