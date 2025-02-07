import { systemRoles } from "../../utilities/systemRole.js";

export const addReviewpoints = {
    ADD_REVIEW: [systemRoles.ADMIN,systemRoles.SUPER_ADMIN],
    UPDATE_REVIEW: [systemRoles.ADMIN,systemRoles.SUPER_ADMIN],
}