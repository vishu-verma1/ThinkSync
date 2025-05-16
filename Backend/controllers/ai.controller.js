import result from "../services/ai.service.js";

export const  getResult = async (req, res)=>{
try {
    const prompt = req.query.prompt;
    const response = await result(prompt);
    res.send(response)

} catch (error) {
    console.error("Error in getResult:", error)
    res.status(500).send({message:"internal server Eroor ", error :error})
}
}