export async function syncToCrm(importId: string): Promise<{ crmId: string }> {
  console.log(`[crm] Simulating CRM sync for import ${importId} ...`);
  await new Promise((resolve) => setTimeout(resolve, 200));
  const crmId = `crm_${crypto.randomUUID()}`;
  console.log(`[crm] Sync complete — crmId: ${crmId}`);
  return { crmId };
}
