import { AdminContainer } from "../../../../components/admin/admin.style.tsx";
import { useNavigate, useParams } from "react-router";
import { useCallback, useEffect, useState } from "react";
import type { Notice } from "../../../../types/notice.type.ts";
import noticeApi from "../../../../api/user/noticeApi.ts";


function AdminDetailNoticePage() {
    const navigate = useNavigate();
    const [notice, setNotice] = useState<Notice | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { id } = useParams<{id : string}>();

    const loadNotice = useCallback(async () => {
        try {
            const data = await noticeApi.getNoticeById(id);
            setNotice(data);
        } catch (error) {
            console.log(error);
            alert("게시글을 불러오는 중 오류가 발생했습니다.");
            navigate(-1);
        } finally {
            setIsLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadNotice().then(() => {});
    }, [id, loadNotice]);
    if (isLoading) {
        return (
            <AdminContainer></AdminContainer>
        )
    }

    return <AdminContainer>
    </AdminContainer>;
}

export default AdminDetailNoticePage;
