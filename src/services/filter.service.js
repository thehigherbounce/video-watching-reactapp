class FilterService {

    getTypeTags() {
        let tags = fetch('/data/type_tags.json').then(res => res.json())
            .then(d => d.data);
        return tags;
    }
}


export default new FilterService();