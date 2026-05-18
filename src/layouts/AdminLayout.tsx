import styled from "styled-components";
import { Link, Outlet } from "react-router";
import { FiGrid, FiHome, FiUser } from "react-icons/fi";

function AdminLayout() {
    return <AdminContainer>
        <AdminSidebar>
            <SidebarHeader to={"/admin"}>관리자 센터</SidebarHeader>
            <SidebarMenu>
                <MenuItem to={"/admin/category"}>
                    <FiGrid size={18} />
                    카테고리 관리
                </MenuItem>
                <MenuItem to={"/admin/user"}>
                    <FiUser size={18} />
                    유저관리
                </MenuItem>
                <MenuItem to={"/"}>
                    <FiHome size={18} />
                    서비스로 돌아가기
                </MenuItem>
            </SidebarMenu>
        </AdminSidebar>
        <AdminMain>
            <AdminContentInner>
                <Outlet />
            </AdminContentInner>
        </AdminMain>
    </AdminContainer>;
}

export default AdminLayout;


const AdminContainer = styled.div`
    display: flex;
    min-height: 100dvh;
    background-color: ${props => props.theme.colors.background.default};
`;

const AdminSidebar = styled.aside`
    width: 260px;
    background-color: ${props => props.theme.colors.background.paper};
    border-right: 1px solid ${props => props.theme.colors.divider};
    display: flex;
    flex-direction: column;
`;

const SidebarHeader = styled(Link)`
    height: 64px;
    display: flex;
    align-items: center;
    padding: 0 24px;
    font-size: 20px;
    font-weight: 800;
    color: ${props => props.theme.colors.primary};
    border-bottom: 1px solid ${props => props.theme.colors.divider};
`;

const SidebarMenu = styled.nav`
    display: flex;
    flex-direction: column;
    padding: 16px 0;
    gap: 8px;
`;

const MenuItem = styled(Link)`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 24px;
    font-size: 15px;
    font-weight: 500;
    background-color: ${props => props.theme.colors.background.default}
    color: ${props => props.theme.colors.primary}';
`;

const AdminMain = styled.main`
    flex: 1;
    padding: 32px;
    overflow-y: auto;
`;

const AdminContentInner = styled.div`
    max-width: 1000px;
    margin: 0 auto;
    width: 100%;
`;