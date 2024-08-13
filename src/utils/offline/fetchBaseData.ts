// fetchBaseData.ts
import { useConstructionStore } from '@/store/construction'
import { useInspectionStore } from '@/store/inspection'

export const fetchBaseData = async (
  constructionStore: ReturnType<typeof useConstructionStore>,
  inspectionStore: ReturnType<typeof useInspectionStore>,
): Promise<void> => {
  try {
    await constructionStore.getWindTurbineData() // 风机
    await constructionStore.getCableData() // 海缆
    await constructionStore.getAllProcesses() // 工序
  } catch (error) {
    console.error('Failed to fetch construction data:', error)
  }
  try {
    await inspectionStore.getAllShip({ option: 9 }) // 所有船只
  } catch (error) {
    console.error('Failed to fetch all ships:', error)
  }
}
