# API Specification

本專案使用 [Committee](https://github.com/interagent/committee) 搭配 OpenAPI 3 規格，提供 API 的 request/response 驗證與文件。

## 規格檔案

- `openapi.yaml` - OpenAPI 3.0 定義，描述 `/api/v1` 底下的所有端點

## 使用方式

### 查看 API 文件

可使用 [Swagger Editor](https://editor.swagger.io) 或 [Swagger UI](https://swagger.io/tools/swagger-ui/) 匯入 `openapi.yaml` 檢視互動式文件。

### 驗證開關

- **development / test**：預設啟用 Committee 驗證
- **production**：預設關閉，可透過 `COMMITTEE_VALIDATE=true` 啟用
- 強制關閉：`COMMITTEE_VALIDATE=false`

### 驗證內容

- **RequestValidation**：檢查請求參數是否符合 schema
- **ResponseValidation**：檢查 2xx 回應是否符合 schema
