import { getChores, useChores } from "./ChoreProvider.js"
import { getFamilyMembers, useFamilyMembers } from "./FamilyProvider.js"
import { getFamilyChores, useFamilyChores } from "./FamilyChoreProvider.js"
import { FamilyMember } from "./FamilyMember.js"

// targeting empty section tag on main
const contentTarget = document.querySelector(".family")

/*
    Component state variables with initial values
*/
let chores = []
let people = []
let peopleChores = []


/*
    Main component logic function
*/
export const FamilyList = () => {
    getChores()
        .then(getFamilyMembers)
        .then(getFamilyChores)
        .then(() => {
            /*
                Update component state, which comes from application
                state, which came from API state.

                API -> Application -> Component
            */
            chores = useChores()
            people = useFamilyMembers()
            peopleChores = useFamilyChores()

            render()
        })
}

/*
    Component render function
*/
const render = () => {
    // set the content target to = the html string that the .map returns
        //  the .map iterates over the PEOPLE Array of Objects
    contentTarget.innerHTML = people.map(person => {
        const relationshipObjects = getChoreRelationships(person)
        /*
            End result for family member 1...

        relationshipObjects = [
                { "id": 1, "familyMemberId": 1, "choreId": 4 },
                { "id": 2, "familyMemberId": 1, "choreId": 5 }
            ]
            This function 

        */

        const choreObjects = convertChoreIdsToChores(relationshipObjects)
        /*
            End result for family member 1...

            choreObjects = [
                { "id": 4, "task": "Clean the bedrooms" },
                { "id": 5, "task": "Family game night" }
            ]
        */

        // Get HTML representation of product
        // takes current personObj from the .map and the choreObjects array
        // for the current person
        const html = FamilyMember(person, choreObjects)

        return html
    }).join("")
}



// Get corresponding relationship objects for a person
// Takes a person object. Filters the "familyChores" array to find which objects match 
// the current person Id
const getChoreRelationships = (person) => {
    const relatedChores = peopleChores.filter(pc => pc.familyMemberId === person.id)

    return relatedChores
}

// Convert array of foreign keys to array of objects
//  takes array of familyChores which holds 2 fkS, filters over to find the correspodning 
// chore, returns array of chores
const convertChoreIdsToChores = (relationships) => {
    const choreObjects = relationships.map(rc => {
        return chores.find(chore => chore.id === rc.choreId)
    })

    return choreObjects
}