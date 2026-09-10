# 100 Use Cases For Copilot With EAI

## How To Read The Catalogue

These are not 100 separate integrations. They are 100 tests of one reusable EAI Connection for Microsoft Copilot.

Each case uses one or more standard patterns:

| Pattern | Connection behavior |
| --- | --- |
| A - External access | EAI External ID authenticates a customer, partner, citizen or contractor outside the enterprise workforce tenant. |
| B - Governed retrieval | Copilot calls an allowlisted PublicAPI V4 read tool; Authz and tenant membership filter the ResourceAPI result. |
| C - Controlled mutation | Copilot confirms a create, version-aware update or action; PublicAPI reauthorizes and returns an audit receipt. |
| D - Document intelligence | EAI stores the document, AICore runs approved Content Understanding, and ResourceAPI stores grounded typed output. |
| E - Microsoft context | AzureAPI retrieves approved Microsoft 365 content using separate delegated Graph consent, then PublicAPI applies EAI policy. |
| F - Long-running workflow | PublicAPI starts a job and returns an opaque ID; Copilot polls bounded status and result tools. |

Priority reflects likely customer value, differentiation and implementation practicality. It is not permission to automate high-risk decisions without human approval.

## Priority 1: Lead Offers

| Rank | Use case | Copilot experience | Why EAI makes it more valuable | Pattern |
| ---: | --- | --- | --- | --- |
| 1 | Customer case self-service | A customer asks for case status, evidence and next steps in their normal Copilot experience. | CIAM admits the external customer; EAI returns only their tenant-scoped case and records any response. | A, B, C |
| 2 | Supplier onboarding | A supplier submits company, insurance and compliance evidence and tracks approval. | EAI authenticates the supplier, extracts documents, stores structured evidence and routes human approval. | A, C, D, F |
| 3 | Partner project workspace | A delivery partner asks for milestones, risks and assigned actions across a joint project. | EAI provides cross-organization identity, project-scoped authorization and one operational record outside SharePoint. | A, B, C, E |
| 4 | Citizen application tracking | A citizen checks a permit, grant or service application and supplies missing information. | CIAM supports public users while EAI isolates the application, evidence and council workflow. | A, B, C, D |
| 5 | Contract obligation assistant | A user asks what is due, who owns it and whether evidence has been supplied. | EAI converts contracts into governed obligations, dates, owners and auditable completion records. | B, C, D, E |
| 6 | Compliance evidence collection | Copilot identifies missing controls and requests or accepts supporting evidence. | EAI stores control, requirement, evidence, reviewer and decision as linked tenant records. | A, B, C, D |
| 7 | Service complaint resolution | A customer describes a problem, sees progress and approves the proposed resolution. | EAI joins external identity, case history, policy, approvals and audit without exposing unrelated CRM data. | A, B, C |
| 8 | Document-to-case intake | A user submits a form, letter or email and Copilot creates a draft case. | Content Understanding extracts grounded fields; EAI validates, stores and links the source before creation. | C, D, E, F |
| 9 | Controlled customer data update | A customer asks to change contact, asset or service details and confirms the exact update. | EAI verifies ownership, uses optimistic versioning and produces a traceable receipt instead of a free-form edit. | A, B, C |
| 10 | Tenant-safe executive briefing | An executive asks for current risks, decisions and actions across authorized business units. | EAI enforces tenant hierarchy and record-level permissions while retaining source links and decision evidence. | B, E |
| 11 | Audit request response | An auditor requests selected evidence and explanations through Copilot. | EAI grants time-bound scoped access and returns only approved evidence with immutable audit history. | A, B, D |
| 12 | Policy question to controlled action | An employee asks what policy requires, then creates a compliant task or approval. | EAI binds the answer to current policy, user authority and a governed downstream action. | B, C, E |
| 13 | Incident evidence pack | An incident lead asks Copilot to assemble timeline, impacts, owners and source evidence. | EAI stores an operational incident model and prevents cross-tenant or unauthorized evidence leakage. | B, C, D, E |
| 14 | Account plan collaboration | Internal and customer users review outcomes, commitments and open decisions in one conversation. | CIAM and EAI permissions allow safe cross-enterprise collaboration over shared, structured account records. | A, B, C |
| 15 | Proposal compliance review | A salesperson asks whether a proposal meets customer, legal and delivery requirements. | EAI applies approved checks, stores findings and creates review tasks without turning Copilot into the approver. | B, C, D, E |
| 16 | Claims evidence intake | A claimant submits evidence and tracks review without seeing other claims. | EAI provides external identity, claim isolation, typed extraction and human decision workflow. | A, B, C, D, F |
| 17 | Contractor credential management | A contractor uploads licences, inductions and expiry evidence and receives renewal actions. | EAI authenticates non-employees and stores verified credentials against the right contract and site. | A, C, D |
| 18 | Customer order exception | A customer asks why an order is delayed and accepts an approved alternative. | EAI joins order status, entitlement, exception policy and confirmed action in one auditable flow. | A, B, C |
| 19 | Board action register | Directors ask for unresolved decisions and confirm action updates after a meeting. | EAI provides restricted board data, version-aware updates and a durable decision trail. | B, C, E |
| 20 | Regulated advice preparation | A professional asks Copilot to assemble facts and draft advice for expert approval. | EAI separates evidence, model output, reviewer decision and final issued record; humans retain accountability. | B, C, D, E |
| 21 | Customer document request | A customer asks what evidence is missing and uploads only the required documents. | EAI calculates requirements from case state and securely links each submission to the correct record. | A, B, C, D |
| 22 | Procurement evaluation workspace | Evaluators compare supplier responses and record scored findings with declared conflicts. | EAI enforces panel roles, separates suppliers and preserves source-grounded scoring evidence. | A, B, C, D |
| 23 | Grant application assessment | Applicants submit material; assessors use Copilot to review completeness and record recommendations. | EAI isolates applicant access, structures evidence and requires human approval for funding decisions. | A, B, C, D |
| 24 | Field defect resolution | A field worker describes or photographs a defect, receives history and creates a repair action. | EAI links asset, location, evidence, risk and work order under tenant policy. | B, C, D, F |
| 25 | Data-quality exception handling | An analyst asks which records failed validation and approves corrected values. | EAI stores validation results, source lineage, proposed changes and version-safe corrections. | B, C, F |

## Priority 2: Scale Across Business Functions

| Rank | Use case | Copilot experience | Why EAI makes it more valuable | Pattern |
| ---: | --- | --- | --- | --- |
| 26 | Customer renewal preparation | An account manager asks for usage, issues, obligations and renewal risks. | EAI joins operational customer records with approved Microsoft context and stores renewal actions. | B, C, E |
| 27 | Supplier performance review | A manager compares delivery, quality, safety and contract evidence. | EAI provides a common semantic supplier record with source-level permissions and review history. | B, C, D |
| 28 | Change request assessment | A project user submits a change and Copilot identifies affected scope, cost and approvals. | EAI connects the request to project baselines and controls the approval mutation. | B, C, D |
| 29 | Project status reporting | Copilot assembles current milestones, risks, dependencies and decisions for a status pack. | EAI uses live structured project data rather than relying only on document summaries. | B, E |
| 30 | Meeting decision capture | Copilot proposes decisions and actions from a meeting for participant confirmation. | EAI stores approved actions against governed projects and preserves the source meeting reference. | C, E |
| 31 | Customer success health review | A manager asks which customers need intervention and why. | EAI combines authorized signals into explainable health records and creates controlled follow-ups. | B, C |
| 32 | Warranty claim triage | A customer submits product evidence and receives a review status. | EAI validates product ownership, extracts evidence and routes rather than auto-decides the claim. | A, B, C, D |
| 33 | Maintenance work request | A worker reports an issue and Copilot creates a correctly classified maintenance request. | EAI validates asset and site scope, stores evidence and deduplicates repeated submissions. | B, C, D |
| 34 | Asset inspection assistant | An inspector reviews prior defects, records findings and submits an inspection. | EAI provides offline-capable app continuity plus tenant-scoped records and formal completion evidence. | B, C, D |
| 35 | Safety observation | An employee or contractor records a hazard and confirms immediate controls. | CIAM covers contractors; EAI stores location, evidence, risk and accountable action without automating safety judgement. | A, C, D |
| 36 | Environmental compliance monitoring | Copilot explains threshold exceptions and creates investigation actions. | EAI links measurements, permits, sites, evidence and corrective workflow. | B, C, F |
| 37 | Construction progress evidence | A contractor submits progress photos and claims completed work. | EAI authenticates the contractor, links evidence to scope and sends claims for authorized review. | A, C, D |
| 38 | Planning application review | A planner asks for relevant controls, submissions, referrals and unresolved matters. | EAI combines governed planning data and documents while retaining human statutory decisions. | B, C, D, E |
| 39 | Development contribution tracking | Staff ask what contributions are due, paid or disputed for an application. | EAI stores calculated obligations, evidence and approvals as linked tenant records. | B, C |
| 40 | Community consultation analysis | Staff summarize submissions by issue and inspect grounded source excerpts. | EAI controls sensitive submissions, uses approved analysis and stores reviewable themes rather than only chat output. | B, D, F |
| 41 | Freedom-of-information triage | An officer finds potentially relevant records and prepares a review set. | EAI applies case scope and redaction workflow; Copilot does not make the release decision. | B, C, D, E |
| 42 | Records retention review | A records manager asks which items reach a retention event and approves disposition steps. | EAI retains classification, legal hold, approval and deletion evidence under policy. | B, C, E |
| 43 | Privacy access request | A person submits a request and an officer assembles scoped personal records for review. | CIAM verifies the requester; EAI tracks identity proof, searches, exemptions and release evidence. | A, B, C, D |
| 44 | Data breach response | The response team asks who, what data and which notifications are affected. | EAI joins incident, data classification, affected parties and approved notification workflow. | B, C, E, F |
| 45 | Risk register maintenance | A risk owner asks for changes in exposure and confirms a treatment update. | EAI stores authoritative risk, control, owner and version rather than editing a spreadsheet copy. | B, C, E |
| 46 | Control testing | A tester requests samples, attaches evidence and records a test outcome. | EAI separates preparer and reviewer permissions and preserves evidence lineage. | B, C, D |
| 47 | Internal audit follow-up | Audit teams ask which findings are overdue and request owner updates. | EAI provides scoped findings, action ownership, due dates and immutable closure evidence. | B, C |
| 48 | Delegation-of-authority check | A user asks whether they may approve a transaction before taking action. | Authz and EAI policy evaluate current role, tenant, amount and resource instead of trusting prompt text. | B, C |
| 49 | Expense exception review | A manager asks why an expense was flagged and records a decision. | EAI links policy, transaction evidence, reviewer authority and decision receipt. | B, C, D |
| 50 | Invoice discrepancy resolution | AP staff compare invoice, purchase order and receipt, then raise a controlled exception. | EAI stores matched entities and evidence while keeping ERP action behind approval. | B, C, D, E |
| 51 | Budget variance explanation | A finance user asks what drove a variance and creates investigation actions. | EAI stores governed analytical outputs and action ownership, with Fabric or source links retained. | B, C, E |
| 52 | Forecast assumption register | Teams ask which assumptions changed and confirm an approved forecast input. | EAI versions assumptions and approvals rather than allowing silent spreadsheet overwrites. | B, C, E |
| 53 | Revenue leakage investigation | Copilot identifies unmatched usage, contract and billing records for analyst review. | EAI provides a tenant-safe semantic model and auditable remediation queue. | B, C, F |
| 54 | Customer credit review pack | A credit analyst asks for current evidence and missing approvals. | EAI assembles governed inputs but retains human decision, segregation and record of rationale. | B, C, D |
| 55 | Contract variation approval | A manager reviews change evidence and confirms or rejects a draft variation. | EAI validates signing authority, current contract version and required approvals. | B, C, D |
| 56 | Purchase request orchestration | A user describes a need and Copilot creates a compliant draft purchase request. | EAI structures the request, checks policy and routes approval without giving Copilot purchasing authority. | B, C |
| 57 | Inventory exception | Operations users ask about shortage, surplus or quarantine and create a controlled disposition. | EAI links stock, site, lot, quality and authorized action. | B, C |
| 58 | Production batch investigation | A supervisor asks which materials, tests and events affected a batch. | EAI stores traceable batch relationships and preserves source evidence across systems. | B, D, F |
| 59 | Quality non-conformance | A user records a non-conformance, evidence, containment and assigned investigation. | EAI enforces site and role scope and maintains the formal quality record. | B, C, D |
| 60 | Logistics exception management | Copilot explains a delayed or damaged shipment and proposes permitted next steps. | EAI combines customer, carrier, order and evidence records and records the selected resolution. | A, B, C |

## Priority 3: Broader Extensions

| Rank | Use case | Copilot experience | Why EAI makes it more valuable | Pattern |
| ---: | --- | --- | --- | --- |
| 61 | Knowledge answer with case context | A service agent asks a policy question scoped to the current customer case. | EAI combines governed knowledge with authorized operational context without indexing all case data into Graph. | B, E |
| 62 | Expert-finder request | A user asks who is authorized and available to review a specialist issue. | EAI uses skills, tenant access and workload records rather than a broad directory search alone. | B, E |
| 63 | Training evidence tracker | A worker asks what training is due and submits completion evidence. | EAI supports employees and contractors with role/site-specific requirements and records. | A, B, C, D |
| 64 | Competency assessment | A supervisor reviews evidence and records a competency recommendation for approval. | EAI separates evidence, assessor, approver and effective-date controls. | B, C, D |
| 65 | Employee onboarding tasks | A new starter asks what remains and completes approved onboarding steps. | EAI orchestrates cross-system tasks while keeping sensitive HR data and permissions scoped. | B, C, E |
| 66 | Contractor offboarding | A manager asks which access, assets and obligations remain before contract close. | EAI coordinates external identity disablement, returns and evidence without deleting shared history. | A, B, C |
| 67 | Role handover pack | A departing employee asks Copilot to assemble open decisions, responsibilities and successors. | EAI uses structured ownership and approval records, not only mailbox or document inference. | B, C, E |
| 68 | Procedure execution checklist | A worker follows a controlled procedure and records each required step. | EAI versions the procedure and stores completion evidence against the right asset or case. | B, C |
| 69 | Shift handover | Teams ask for unresolved incidents, constraints and actions at shift change. | EAI provides live operations state with accountable acceptance of handover items. | B, C |
| 70 | Workforce licence expiry | A manager asks which licences are expiring and initiates renewal evidence requests. | EAI joins worker, role, site and credential records with external-user support. | A, B, C |
| 71 | Fabric insight to action | An analyst asks about a Fabric metric and creates an EAI investigation or decision record. | Microsoft provides analytics; EAI adds governed workflow, ownership and operational closure. | B, C, E |
| 72 | KPI commentary approval | Copilot drafts commentary from approved metrics for an owner to confirm. | EAI records source metric version, author, approver and issued commentary. | B, C, E |
| 73 | Data lineage question | A user asks where a reported value came from and whether it passed controls. | EAI returns semantic lineage, validation and ownership evidence across tenant data. | B, E |
| 74 | Master-data change request | A business owner proposes a reference-data change and routes it for approval. | EAI uses typed fields, duplicate checks, current version and segregation of duties. | B, C |
| 75 | Data-access request | A user requests access to a dataset or object scope with business justification. | EAI links identity, tenant, purpose, approver and expiry; Authz enforces the grant. | A, B, C |
| 76 | Analytics anomaly case | Copilot identifies an unusual metric and opens a governed investigation. | EAI persists the anomaly, source window, owner and outcome rather than losing it in chat. | B, C, E |
| 77 | Reconciliation exception | Finance or operations asks which source and destination records do not match. | EAI stores deterministic comparison results and controlled correction status. | B, C, F |
| 78 | Data import supervision | A user starts an approved import and monitors validation, deduplication and completion. | EAI applies schema checks and idempotent jobs before changing tenant data. | C, F |
| 79 | Customer data export | A customer requests an authorized export and tracks preparation. | CIAM verifies the requester; EAI applies scope, approval, expiry and download audit. | A, B, C, F |
| 80 | Data deletion request | A user requests deletion of app-owned records and reviews impact before approval. | EAI distinguishes app-owned from shared tenant data and retains deletion evidence. | A, B, C, F |
| 81 | Council asset enquiry | A resident asks about a road, park or facility issue and lodges a service request. | EAI supports citizen identity, geospatial asset context and tenant-owned case workflow. | A, B, C, D |
| 82 | Development site intelligence | A planner asks for applications, constraints, evidence and decisions for a site. | EAI joins geospatial and planning records under statutory access controls. | B, D, E |
| 83 | Mining production exception | A supervisor asks why output or quality deviated and starts an investigation. | EAI links batch, plant, material, source payload and accountable action. | B, C, F |
| 84 | Quarry material traceability | A customer or operator asks which quarry, pit, bench and test evidence supplied a load. | EAI exposes only authorized supply-chain lineage through a common semantic model. | A, B, D |
| 85 | Utility outage communication | A customer asks about an outage and confirms contact or support needs. | EAI combines external identity, service location, event status and controlled customer updates. | A, B, C |
| 86 | Energy connection application | An applicant submits technical documents and tracks assessment milestones. | EAI manages external access, typed evidence, engineering review and approvals. | A, B, C, D |
| 87 | Healthcare referral administration | A patient or provider tracks referral completeness and supplies missing administrative evidence. | EAI protects tenant and case scope; clinical decisions remain with qualified professionals. | A, B, C, D |
| 88 | Aged-care service coordination | An authorized family member asks about agreed non-clinical services and outstanding actions. | EAI manages delegated access, consent, case records and provider actions across organizations. | A, B, C |
| 89 | Insurance policy servicing | A policyholder asks about coverage records and submits a permitted service request. | EAI authenticates the external user and records controlled changes with policy version evidence. | A, B, C, D |
| 90 | Legal matter evidence index | A legal team asks for documents, issues and provenance within one matter. | EAI provides matter-level isolation, evidence lineage, legal-hold controls and source links. | B, D, E |
| 91 | Copilot agent installation request | A tenant admin asks to install an approved EAI agent for a user group. | EAI records tenant/app mapping, approved tools, Microsoft organization and accountable approval. | B, C |
| 92 | Agent tool access review | A security owner asks which Copilot tools can read, write or delete tenant data. | EAI exposes a versioned grant register and actual usage evidence instead of relying on prompt descriptions. | B |
| 93 | Agent disablement | A tenant admin disables one risky tool or the whole Copilot channel. | PublicAPI enforces the change immediately while the underlying EAI app and data can remain available. | B, C |
| 94 | Agent upgrade review | An admin compares old and new tools, scopes, prompts and data changes before upgrading. | EAI produces an immutable release diff and requires approval for expanded capability. | B, C |
| 95 | Agent action audit | An auditor asks who caused a material change, what was confirmed and which version changed. | EAI returns the tool, user, tenant, request, version, result and receipt without exposing secrets. | B |
| 96 | Cross-channel continuity | A customer starts in the EAI app and an employee continues the same case in Copilot. | Both channels use one ResourceAPI record and Authz model rather than synchronizing duplicate stores. | A, B, C |
| 97 | Delegated representative access | A customer authorizes an adviser or family representative for a limited case and period. | EAI stores explicit delegation, scope, expiry and revocation independent of Microsoft tenant membership. | A, B, C |
| 98 | Multi-tenant service operator | An authorized operator asks for issues across several child tenants and drills into one. | EAI tenant hierarchy and Authz provide controlled aggregation without flattening tenant boundaries. | B, C |
| 99 | AI output review queue | Reviewers ask which low-confidence or policy-sensitive AI results require attention. | EAI stores model/analyzer version, grounding, confidence, reviewer and final outcome. | B, C, D |
| 100 | Agent cost and value reporting | A sponsor asks what the agent used, cost and completed across Microsoft and EAI. | EAI separates Microsoft credits, model/provider usage, platform cost and verified business outcomes by tenant/app. | B, E |

## Coverage Check

The catalogue contains exactly 100 ranked use cases:

- Priority 1: 25 lead offers.
- Priority 2: 35 scale opportunities.
- Priority 3: 40 broader extensions.

Together they require the architecture to support external and workforce identity, tenant hierarchy, read and mutation controls, documents, Microsoft Graph context, async workflows, audit, lifecycle management and cross-channel continuity. No case requires Copilot to bypass PublicAPI, Authz or ResourceAPI ownership.

## Recommended First Three Pilots

1. **Supplier onboarding:** strongest demonstration of CIAM, document intelligence, structured storage and approval.
2. **Customer case self-service:** clearest demonstration that EAI expands Copilot beyond internal workforce users while preserving case isolation.
3. **Contract obligation assistant:** strong enterprise value with bounded reads, grounded evidence and controlled follow-up actions.

The first production pilot should select only one of these and limit its agent package to five or fewer task tools.
