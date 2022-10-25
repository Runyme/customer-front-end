// Templates Parent
import AppTemplate from '@/templates/App'

//Middlewares
import auth from '@/router/middleware/auth'
import empresa from '@/router/middleware/empresa'
import inadimplencia from '@/router/middleware/inadimplencia'
import tokenize from '@/router/middleware/tokenize'
import firstAcess from '@/router/middleware/firstAcess'

// Auth
import Auth from '../views/Auth/Auth'
import AuthLogin from '@/views/Auth/Login'
import AuthEmpresa from '@/views/Auth/Empresa'

// ZendskChat
import ChatZendsk from "../components/layout/ChatZendsk";

// Views
import Dashboard from '../views/Dashboard'
import Profile from '../views/Profile'
import PageNotFound from '../views/PageNotFound'
import Declaracoes from '../views/Declaracoes'
import IndexNfse from '../views/NotaFiscal/Index'
import EmissaoNfse from '../views/NotaFiscal/Emissao'
import PaymentTokenize from '../views/Payment/Tokenize'
import PaymentBilling from '../views/Payment/Billing'
import Documentos from '../views/Documentos'
import Questionario from '../views/Irpf/Questionario'
import Pendencia from '../views/Irpf/Pendencia'
import AssinarContrato from '../views/AssinarContrato'
import ConviteIndicacao from '../views/ConviteIndicacao'

const baseMiddleware = [
  auth,
  empresa,
  tokenize,
  inadimplencia,
  // firstAcess
]

export default [
  {
    path: '',
    name: 'App',
    component: AppTemplate,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
          middleware: baseMiddleware
        },
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile,
        meta: {
          middleware: [
            auth,
            empresa,
            tokenize,
            inadimplencia,
          ]
        },
      },
      {
        path: 'declaracoes',
        name: 'Declaracoes',
        component: Declaracoes,
        meta: {
          middleware: baseMiddleware
        },
      },
      {
        path: 'nota-fiscal/emitir',
        name: 'EmissaoNfse',
        component: EmissaoNfse,
        meta: {
          middleware: baseMiddleware
        },
      },
      {
        path: 'nota-fiscal',
        name: 'NotaFiscal',
        component: IndexNfse,
        meta: {
          middleware: baseMiddleware
        },
      },
      {
        path: 'documentos',
        name: 'Documentos',
        component: Documentos,
        meta: {
          middleware: baseMiddleware
        },
      },
    ]
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth,
    children: [
      {
        path: 'login',
        name: 'AuthLogin',
        component: AuthLogin
      },
      {
        path: 'empresa',
        name: 'AuthEmpresa',
        component: AuthEmpresa,
      },
    ]
  },
  {
    path: '/payment/tokenize',
    name: 'PaymentTokenize',
    component: PaymentTokenize,
    meta: {
      middleware: [auth, empresa]
    }
  },
  {
    path: '/payment/billing',
    name: 'PaymentBilling',
    component: PaymentBilling,
    meta: {
      middleware: [auth, empresa]
    }
  },
  {
    path: '/irpf/questionario',
    name: 'IrpfQuestionario',
    component: Questionario,
    meta: {
      middleware: baseMiddleware
    }
  },
  {
    path: '/irpf/pendencia',
    name: 'IrpfPendencia',
    component: Pendencia,
    meta: {
      middleware: baseMiddleware
    }
  },
  {
    path: '*',
    name: 'PageNotFound',
    component: PageNotFound,
  },
  {
    path: '/assinar-contrato',
    name: 'AssinarContrato',
    component: AssinarContrato,
  },
  {
    path: '/:id/convite-amigo',
    name: 'ConviteIndicacao',
    component: ConviteIndicacao,
  }
];
