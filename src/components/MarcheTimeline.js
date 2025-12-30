// src/components/MarcheTimeline.js
import { FiClock, FiCheckCircle, FiAlertTriangle, FiXCircle } from 'react-icons/fi';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const getJoursRestants = (dateFinPrevue) => {
  const today = new Date();
  const fin = new Date(dateFinPrevue);
  const diffTime = fin.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getStatusColor = (etat) => {
  switch (etat) {
    case 'EN_RETARD':
      return {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: <FiXCircle className="text-red-600" />,
      };
    case 'A_RISQUE':
      return {
        bg: 'bg-orange-100',
        text: 'text-orange-800',
        icon: <FiAlertTriangle className="text-orange-600" />,
      };
    default:
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: <FiCheckCircle className="text-green-600" />,
      };
  }
};

const formatDate = (isoDate) => {
  return format(new Date(isoDate), 'dd/MM/yyyy', { locale: fr });
};

export const MarcheTimeline = ({ marche }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-4xl w-full">
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        Marché <span className="text-blue-600">#{marche.numero}</span> • {marche.type}
      </h2>

      <div className="relative mt-8">
        {/* Ligne verticale de la timeline */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        <div className="space-y-8 ml-12">
          {marche.phases.map((phase) => {
            const jours = getJoursRestants(phase.dateFinPrevue);
            const { bg, text, icon } = getStatusColor(phase.etat);
            const isEnRetard = phase.etat === 'EN_RETARD';
            const isARisque = phase.etat === 'A_RISQUE';

            return (
              <div key={phase.id} className="relative">
                {/* Point coloré de la timeline */}
                <div
                  className={`absolute -left-10 top-1 w-5 h-5 rounded-full border-4 ${
                    isEnRetard ? 'bg-red-500' : isARisque ? 'bg-orange-500' : 'bg-green-500'
                  }`}
                />

                <div
                  className={`${bg} p-4 rounded-lg border-l-4 ${
                    isEnRetard ? 'border-red-500' : isARisque ? 'border-orange-500' : 'border-green-500'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800">{phase.nom}</h3>
                      <p className="text-sm text-gray-600">
                        Du {formatDate(phase.dateDebut)} au {formatDate(phase.dateFinPrevue)}
                      </p>
                    </div>
                    <div className="text-right">
                      {isEnRetard ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-800 bg-red-100 rounded">
                          {icon} En retard
                        </span>
                      ) : jours >= 0 ? (
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium ${text} ${bg} rounded`}>
                          <FiClock />
                          {jours === 0 ? 'Aujourd’hui' : `J-${jours}`}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Liste des étapes clés */}
                  {phase.etapes && phase.etapes.length > 0 && (
                    <div className="mt-3 space-y-1">
                      <p className="text-xs font-medium text-gray-700">Étapes clés :</p>
                      <ul className="space-y-1">
                        {phase.etapes.map((etape) => (
                          <li key={etape.code || etape.libelle} className="text-xs flex items-center gap-2">
                            {etape.realisee ? (
                              <FiCheckCircle className="text-green-600 flex-shrink-0" />
                            ) : (
                              <FiClock className="text-gray-500 flex-shrink-0" />
                            )}
                            <span className={etape.realisee ? 'line-through text-gray-500' : 'text-gray-700'}>
                              {etape.libelle}
                            </span>
                            {!etape.realisee && etape.datePrevue && (
                              <span className="text-gray-500">(échéance: {formatDate(etape.datePrevue)})</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};