const save = async (req, res) => {
    try {
        
    } catch (error) {
        res.sendServerError(error.message);
        req.logger.error(error.message);
    }
}

export {
    save,
}