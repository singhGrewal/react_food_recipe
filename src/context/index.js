import {createContext, useState} from "react";
import {useNavigate} from "react-router-dom";

export const GlobalContext = createContext(null);

export default function GlobalState({children}) {
    const navigate = useNavigate()

    const [searchParam, setSearchParam] = useState("");
    const [loading, setLoading] = useState(false);
    const [recipeList, setRecipeList] = useState([]);
    const [recipeDetailsData, setRecipeDetailsData] = useState(null);
    const [favoritesList, setFavoritesList] = useState([])

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            const res = await fetch(
                `https://forkify-api.herokuapp.com/api/v2/recipes?search=${searchParam}`
            );

            const data = await res.json();
            if (data?.data?.recipes) {
                setRecipeList(data?.data?.recipes);
                setLoading(false);
                setSearchParam("");
                navigate('/')
            }
        } catch (e) {
            console.log(e);
            setLoading(false);
            setSearchParam("");
        }
    }

    function handleAddToFavorite(getCurrentItem){
        let cpyFavoritesList = [...favoritesList];
        const index = cpyFavoritesList.findIndex(item=> item.id === getCurrentItem.id)

        if (index === -1) {
            setFavoritesList(prevList => [...prevList, getCurrentItem]); // Add item if not present
        } else {
            setFavoritesList(prevList => prevList.filter(item => item.id !== getCurrentItem.id)); // Remove item if present
        }
    }

    return (
        <GlobalContext.Provider
            value={{
                searchParam,
                loading,
                recipeList,
                setSearchParam,
                handleSubmit,
                recipeDetailsData,
                setRecipeDetailsData,
                handleAddToFavorite,
                favoritesList
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
}
