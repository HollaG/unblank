import { TRIES_BEFORE_PENALTY } from "../components/ChallengeMode/EndedText";

export const calculateStickmanStage = (tries: number, skipped?: boolean) => {
    let stage = 0;
    if (tries >= TRIES_BEFORE_PENALTY) {
        stage = Math.abs(TRIES_BEFORE_PENALTY - tries) + 1;
    }
    if (stage > 5) stage = 5;
    if (skipped) stage = 5
    return stage
}

/* Generate n unique numbers between a and b, inclusive */
export const generateUniqueNumbers = (n: number, a: number, b: number) => {
    const result = [];
    while (result.length < n) {
        const random = Math.floor(Math.random() * (b - a + 1) + a);
        if (result.indexOf(random) === -1) result.push(random);
    }
    return result;
}