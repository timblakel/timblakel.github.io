
export enum CardKind {
    Food = "Food", 
    Animal = "Animal"
}

export interface Card {
    ID: number
    kind: CardKind
    front: string
    fack: string
}