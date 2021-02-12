export const FamilyMember = (person, chores) => {
    return `
        <section class="familyMember">
            <header>
                <h2>${person.name}</h2>
            </header>
            <div>
                <ol>
                    ${
                        chores.map(chore => `<li>${chore.task}</li>`).join("")
                    }
                </ol>
            </div>
        </section>
    `
}