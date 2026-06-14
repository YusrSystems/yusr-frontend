import {Cubit} from "yusr-ui";
import {
    DashboardErrorState,
    DashboardLoadedState, DashboardLoadingState,
    DashboardState
} from "@/features/dashboard/logic/dashboardState.ts";
import  {DashboardData} from "@/core/data/dashboardData.ts";
import DashboardApiService from "@/core/networking/dashboardApiService.ts";

export default  class DashboardCubit extends  Cubit<DashboardState>{
    public data?: DashboardData;
    constructor() {
        super(new DashboardLoadingState());
    }
    public async init()
    {
        const service = new DashboardApiService();
        try {
            this.emit(new DashboardLoadingState())
            const result = await service.get();

            if(result.status === 200 && result.data)
            {
                this.data = new DashboardData(result.data);

                this.emit(new DashboardLoadedState())
                ;
            }
        }catch
        {
            console.log("Could not get dashboard");
            this.emit(new DashboardErrorState());
        }
    }
}