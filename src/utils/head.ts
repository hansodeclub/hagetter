const head = <Data>(data?: Data | Data[]) => {
    if (!data) return undefined;
    if (Array.isArray(data)) {
        return data.length > 0 ? data[0] : undefined;
    }

    return data;
}

export default head;