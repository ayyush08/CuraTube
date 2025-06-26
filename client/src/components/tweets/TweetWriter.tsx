import { useAppSelector } from "@/redux/hooks"



const TweetWriter = () => {
    const storedUser = useAppSelector(state=>state.auth.user)

    if(!storedUser){
        return null
    }
    
    return (
        <div>TweetWriter</div>
    )
}

export default TweetWriter