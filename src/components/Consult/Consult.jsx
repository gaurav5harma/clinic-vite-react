import { useEffect } from "react";
import { toast } from "react-toastify";
import PageWrapper from "../../hoc/PageWrapper";
import { getCurrentConsultationService } from "../../services/HTTPService";

const Consult = () => {
  useEffect(() => {
    getCurrentConsultationService({})
      .then((response) => {
        if (response.data.status !== "success") {
          toast.error(response.data.msg || "Unable to fetch current consultation.");
        }
      })
      .catch(() => {
        toast.error("Unable to fetch current consultation.");
      });
  }, []);

  return (
    <PageWrapper title="Consult">
      <div className="row card p-3">
        <div className="col-12"></div>
      </div>
    </PageWrapper>
  );
};

export default Consult;