import { Heading } from "@digdir/designsystemet-react"
import { FilesIcon } from "@navikt/aksel-icons"







export const ResourceSearchPage = () => {
    return (
        <div>
            <Heading level={1} data-size="sm">
                Søk etter ressurser
                <FilesIcon title="Beta" />
            </Heading>
        </div>
    )
}