import { useEffect, useState } from 'react'
import {
  CircleDollarSign,
  Download,
  TrendingUp,
  FileCheck,
  ShieldAlert,
  CreditCard,
  Building,
  User,
} from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import Loading from '../../components/Loading'
import ErrorMessage from '../../components/ErrorMessage'
import { getPayroll } from '../../services/payrollService'
import { getApiError } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const unwrap = (result) =>
  result?.payroll || result?.data?.payroll || result?.data || result || null

export default function Payroll() {
  const { user } = useAuth()
  const [payroll, setPayroll] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchPayrollData = async () => {
    setLoading(true)
    setError('')
    try {
      const data = unwrap(await getPayroll())
      setPayroll(data)
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayrollData()
  }, [])

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null || amount === '') return '—'
    if (typeof amount === 'number') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(amount)
    }
    return String(amount)
  }

  if (loading) {
    return <Loading label="Loading payroll and compensation details..." />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchPayrollData} />
  }

  if (!payroll) {
    return (
      <>
        <PageHeader
          eyebrow="COMPENSATION"
          title="Salary & Payroll"
          description="A complete read-only view of your compensation structure and payslips."
        />
        <div className="section-card text-center py-10">
          <p className="muted">Payroll information is currently unavailable.</p>
        </div>
      </>
    )
  }

  const employeeName =
    payroll.employeeName ||
    payroll.name ||
    user?.name ||
    user?.fullName ||
    'Rahul'

  const employeeId =
    payroll.employeeId ||
    user?.employeeId ||
    user?.id ||
    'EMP001'

  const basicSalary = payroll.basicSalary ?? payroll.basic_salary ?? '₹XX,XXX'
  const allowances = payroll.allowances ?? payroll.allowance ?? '₹X,XXX'
  const deductions = payroll.deductions ?? payroll.deduction ?? '₹X,XXX'
  const netSalary = payroll.netSalary ?? payroll.net_salary ?? '₹XX,XXX'

  return (
    <>
      <PageHeader
        eyebrow="COMPENSATION & BENEFITS"
        title="Salary & Payroll Overview"
        description="Official read-only summary of your monthly salary breakdown, allowances, and deductions."
      />

      {/* Net Salary Highlight Banner */}
      <section className="payroll-banner">
        <div className="payroll-icon">
          <CircleDollarSign size={26} />
        </div>
        <div className="payroll-banner-info">
          <span>ESTIMATED NET SALARY</span>
          <strong>{formatCurrency(netSalary)}</strong>
          <small>Disbursed via automated direct payroll deposit</small>
        </div>
      </section>

      {/* Payroll Breakdown Card (Strictly Read-Only) */}
      <section className="section-card payroll-card">
        <div className="card-heading">
          <div>
            <div className="eyebrow">MONTHLY BREAKDOWN</div>
            <h2 className="card-title">Employee Salary Details (Read-Only)</h2>
          </div>
          <button
            className="secondary-button"
            disabled
            title="Download option is enabled when PDF payslips are published by HR"
          >
            <Download size={16} />
            <span>Download Payslip</span>
          </button>
        </div>

        <div className="payroll-details">
          <div className="payroll-field">
            <span className="field-label">Employee Name</span>
            <strong className="field-value">{employeeName}</strong>
          </div>

          <div className="payroll-field">
            <span className="field-label">Employee ID</span>
            <strong className="field-value">{employeeId}</strong>
          </div>

          <div className="payroll-field">
            <span className="field-label">Basic Salary</span>
            <strong className="field-value">{formatCurrency(basicSalary)}</strong>
          </div>

          <div className="payroll-field">
            <span className="field-label">Allowances (HRA / Special)</span>
            <strong className="field-value text-green">{formatCurrency(allowances)}</strong>
          </div>

          <div className="payroll-field">
            <span className="field-label">Statutory Deductions (PF / Tax)</span>
            <strong className="field-value text-red">{formatCurrency(deductions)}</strong>
          </div>

          <div className="payroll-field highlighted">
            <span className="field-label">Net Payable Salary</span>
            <strong className="field-value net-highlight">{formatCurrency(netSalary)}</strong>
          </div>
        </div>

        <div className="payroll-disclaimer">
          <p className="muted small-note">
            Note: Employee compensation records are confidential and managed exclusively by the Human
            Resources & Finance teams. For salary adjustments or tax queries, please reach out to HR.
          </p>
        </div>
      </section>
    </>
  )
}
