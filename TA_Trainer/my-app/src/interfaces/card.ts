
export enum CardKind {
    Food = "Food", 
    Animal = "Animal"
}

export interface Card {
    id: number
    kind: CardKind
    front: string
    back: string
}