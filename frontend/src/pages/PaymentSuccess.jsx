import { Box, Heading, Text, VStack, Icon } from '@chakra-ui/react';
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa'; // Import FontAwesome icon

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const referenceNum = searchParams.get('reference');

  return (
    <Box textAlign="center" p={8} bg="green.100" borderRadius="lg">
      <VStack spacing={4}>
        <Icon as={FaCheckCircle} boxSize="80px" color="green.500" />
        <Heading textTransform="uppercase" fontSize="2xl">
          Order Successful!
        </Heading>
        {referenceNum && (
          <Text fontSize="md">Reference No. {referenceNum}</Text>
        )}
      </VStack>
    </Box>
  );
};

export default PaymentSuccess;
