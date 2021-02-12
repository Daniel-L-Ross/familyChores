import { getChores, useChores } from "./ChoreProvider.js"
import { getFamilyMembers, useFamilyMembers } from "./FamilyProvider.js"
import { getFamilyChores, useFamilyChores } from "./FamilyChoreProvider.js"
import { FamilyMember } from "./FamilyMember.js"

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
    contentTarget.innerHTML = people.map(person => {
        const relationshipObjects = getChoreRelationships(person)
        /*
            End result for family member 1...

            [
                { "id": 1, "familyMemberId": 1, "choreId": 4 },
                { "id": 2, "familyMemberId": 1, "choreId": 5 }
            ]
        */

        const choreObjects = convertChoreIdsToChores(relationshipObjects)
        /*
            End result for family member 1...

            [
                { "id": 4, "task": "Clean the bedrooms" },
                { "id": 5, "task": "Family game night" }
            ]
        */

        // Get HTML representation of product
        const html = FamilyMember(person, choreObjects)

        return html
    }).join("")
}



// Get corresponding relationship objects for a person
const getChoreRelationships = (person) => {
    const relatedChores = peopleChores.filter(pc => pc.familyMemberId === person.id)

    return relatedChores
}

// Convert array of foreign keys to array of objects
const convertChoreIdsToChores = (relationships) => {
    const choreObjects = relationships.map(rc => {
        return chores.find(chore => chore.id === rc.choreId)
    })

    return choreObjects
}