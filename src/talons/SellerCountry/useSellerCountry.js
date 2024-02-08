import { useQuery } from '@apollo/client';

export const useSellerCountry = props => {
    const {
        queries: { getSellerCountriesQuery }
    } = props;

    const { data, error, loading } = useQuery(getSellerCountriesQuery);

    let formattedCountriesData = [{ label: 'Loading Countries...', value: '' }];
    if (!loading && !error) {
        const { sellerCountries } = data;
        formattedCountriesData = sellerCountries.map(country => ({
            // If a country is missing the full english name just show the abbreviation.
            label: country.full_name_english || country.two_letter_abbreviation,
            value: country.two_letter_abbreviation
        }));
        formattedCountriesData.sort((a, b) => (a.label < b.label ? -1 : 1));
    }

    return {
        countries: formattedCountriesData,
        loading
    };
};
