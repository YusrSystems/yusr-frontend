export class PageInitial {}
export class PageLoading {}
export class PageLoaded {}
export class PageError {}
export class PageEmpty {}

export type PageState = PageInitial | PageLoading | PageLoaded | PageEmpty;