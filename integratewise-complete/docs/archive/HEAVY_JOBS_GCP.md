# Heavy Jobs Offloading (GCP Cloud Run)

Large unstructured assets (PDFs, large JSON exports) are too heavy for synchronous Cloudflare Worker execution. Move these jobs to the **Heavy Normalize Path**.

## Flow: The Orchestrated Offload

1. **Ingest**: A file URL is received by the `ingest-normalize` Worker.
2. **Decision**: If the file exceeds 2MB or is a complex type (PDF), the Worker triggers the heavy path.
3. **Dispatch**: The Worker calls `POST /v1/normalize/heavy` on itself or calls the `HeavyNormalizeClient`.
4. **Cloud Run**: A GCP Cloud Run service receives the request, downloads the blob, extracts text, and generates embeddings using heavy Python libraries (e.g., `PyMuPDF`, `sentence-transformers`).
5. **Callback**: Cloud Run writes the result directly to Neon and updates the `knowledge_records` table status to `ready`.

## Configuration

### Environment Variables (Worker)

- `GCP_CLOUD_RUN_URL`: Endpoint of the Cloud Run service.
- `GCP_SERVICE_TOKEN`: Bearer token for service-to-service authentication.

### Testing the Path

You can manually trigger a heavy normalization job using cURL:

```bash
curl -X POST https://normalize.integratewise.ai/v1/normalize/heavy \
  -H "Authorization: Bearer <worker-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "sys_123",
    "resourceType": "knowledge_record",
    "fileUrl": "https://storage.googleapis.com/bucket/source.pdf"
  }'
```

## Cloud Run Contract

**Expected Request**:

```json
{
  "tenantId": "string",
  "resourceType": "string",
  "fileUrl": "string",
  "linkedEntities": ["uuid"]
}
```

**Expected Response**:

- `202 Accepted`
- `{"success": true, "jobId": "uuid"}`
