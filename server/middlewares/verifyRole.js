const verifyRole = (...allowedRoles) => {
    return (req, res, next) => {
        console.log("verifying role");
        console.log(req.roles);
        if (!req?.roles)
            return res.sendStatus(401);
        const allowedRolesArr = [...allowedRoles];
        const allowed = req.roles.some(role => allowedRolesArr.includes(role));
        if (!allowed) {
            console.log("Role not allowed");
            return res.sendStatus(401);
        }
        console.log("Role allowed");
        next();
    }
}

module.exports = verifyRole;