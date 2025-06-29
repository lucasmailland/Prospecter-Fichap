"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetProspectStatsQuery = exports.GetProspectByIdQuery = exports.GetProspectsQuery = void 0;
class GetProspectsQuery {
    filters;
    pagination;
    constructor(filters, pagination) {
        this.filters = filters;
        this.pagination = pagination;
    }
}
exports.GetProspectsQuery = GetProspectsQuery;
class GetProspectByIdQuery {
    id;
    constructor(id) {
        this.id = id;
    }
}
exports.GetProspectByIdQuery = GetProspectByIdQuery;
class GetProspectStatsQuery {
    constructor() { }
}
exports.GetProspectStatsQuery = GetProspectStatsQuery;
//# sourceMappingURL=get-prospects.query.js.map