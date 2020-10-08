export const addFlagToFlagGroup = (flags, flagToAdd) => {
    return [{ ...flagToAdd, id: flags.length, key: flags.length }, ...flags]
}

export const removeFlagFromFlagGroup = (flags) => {
    return flags.slice(1)
}