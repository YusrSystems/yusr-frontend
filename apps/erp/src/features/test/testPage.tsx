import { CrudPage } from "yusr-ui";

export default function TestPage() {
    return <CrudPage>

        <CrudPage.Header
            title="Test Page"
            addButtonTitle="Create Test"
            changeDialog={<></>}
            actionButtons={[]}
            isAddButtonVisible={true}
        />


        {/* note: we could take permissions from global stored user state instead */}
        <CrudPage.Table
            tableHeadRows={[]}
            entities={[]}
            tableRowMapper={() => []}
            permissions={{
                getPermission: false,
                addPermission: false,
                updatePermission: false,
                deletePermission: false
            }}
            perRowPermissions={() => ({
                getPermission: false,
                addPermission: false,
                updatePermission: false,
                deletePermission: false
            })}
            dorpdownItems={() => []}
            contextMenuItems={() => []}
            loadingState={"empty"}

        />

    </CrudPage>
}