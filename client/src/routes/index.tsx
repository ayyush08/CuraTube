
import { apiClient } from "@/api/api-client"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"


export const Route = createFileRoute("/")({
    component: Index,
    
})

function Index() {

    useEffect(() => {
        async function checkHealth() {
            try {
                const res = await apiClient.healthCheck()
                console.log("Health Check Response:", res);
                
            } catch (error) {
                console.error("Error during health check:", error);
            }
        }
        checkHealth();
    },[])

    return (
        <h1>You are home</h1>
    )
}
